const Module = require('node:module')

const state = {
  currentUser: null,
  users: [],
  meals: [],
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

function applyFilters(rows, filters) {
  return rows.filter((row) => filters.every(([field, value]) => row[field] === value))
}

function executeQuery(tableName, query) {
  let rows = state.meals.filter((row) => row.__table === tableName)

  if (query.filters.length > 0) {
    rows = applyFilters(rows, query.filters)
  }

  if (query.operation === 'insert') {
    const inserted = query.payload.map((row) => {
      const record = {
        ...row,
        id: row.id || makeId('meal'),
        __table: tableName,
      }
      state.meals.push(record)
      return record
    })
    return { data: inserted, error: null }
  }

  if (query.operation === 'update') {
    const updated = rows.map((row) => ({ ...row, ...query.payload }))
    state.meals = state.meals.map((entry) => {
      const matched = rows.some((row) => row.id === entry.id)
      if (!matched) return entry
      return updated.find((item) => item.id === entry.id) || entry
    })
    return { data: updated[0] || null, error: null }
  }

  if (query.operation === 'delete') {
    state.meals = state.meals.filter((row) => !rows.some((item) => item.id === row.id))
    return { data: null, error: null }
  }

  if (query.single) {
    return { data: rows[0] || null, error: null }
  }

  return { data: rows, error: null }
}

function createQueryBuilder(tableName) {
  const query = {
    filters: [],
    operation: 'select',
    payload: null,
    single: false,
  }

  const builder = {
    select() {
      query.operation = 'select'
      return builder
    },
    eq(field, value) {
      query.filters.push([field, value])
      return builder
    },
    insert(rows) {
      query.operation = 'insert'
      query.payload = Array.isArray(rows) ? rows : [rows]
      return Promise.resolve({ data: query.payload, error: null })
    },
    update(payload) {
      query.operation = 'update'
      query.payload = payload
      return builder
    },
    delete() {
      query.operation = 'delete'
      return builder
    },
    single() {
      query.single = true
      return Promise.resolve(executeQuery(tableName, query))
    },
    then(resolve, reject) {
      return Promise.resolve(executeQuery(tableName, query)).then(resolve, reject)
    },
  }

  return builder
}

function createSupabaseClient() {
  return {
    auth: {
      async signInWithPassword({ email, password }) {
        const user = state.users.find(
          (entry) => entry.email === email && entry.password === password
        )

        if (!user) {
          return {
            data: { user: null },
            error: { message: 'Invalid login credentials' },
          }
        }

        state.currentUser = {
          id: user.id,
          email: user.email,
          user_metadata: { name: user.name },
        }

        return { data: { user: state.currentUser }, error: null }
      },

      async signUp({ email, password, options }) {
        const userExists = state.users.some((entry) => entry.email === email)
        if (userExists) {
          return {
            data: { user: null },
            error: { message: 'User already registered' },
          }
        }

        const user = {
          id: makeId('user'),
          email,
          password,
          name: options?.data?.name || 'User',
        }

        state.users.push(user)
        state.currentUser = {
          id: user.id,
          email: user.email,
          user_metadata: { name: user.name },
        }

        return { data: { user: state.currentUser }, error: null }
      },

      async getUser() {
        return {
          data: { user: state.currentUser },
          error: null,
        }
      },

      async signOut() {
        state.currentUser = null
        return { error: null }
      },
    },
    from(tableName) {
      return createQueryBuilder(tableName)
    },
    storage: {
      from(tableName) {
        return {
          async upload(fileName, buffer, options) {
            const row = {
              id: makeId('image'),
              __table: tableName,
              fileName,
              buffer: Buffer.from(buffer),
              options,
            }
            state.meals.push(row)
            return { data: row, error: null }
          },
          async remove(files) {
            state.meals = state.meals.filter((meal) => !files.includes(meal.fileName))
            return { data: null, error: null }
          },
        }
      },
    },
  }
}

const originalLoad = Module._load
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === '@supabase/ssr') {
    return {
      createServerClient() {
        return createSupabaseClient()
      },
    }
  }

  if (request === '@supabase/supabase-js') {
    return {
      createClient() {
        return createSupabaseClient()
      },
    }
  }

  return originalLoad.apply(this, arguments)
}

module.exports = {
  state,
  createSupabaseClient,
}
