import fs from 'node:fs'

import slugify from 'slugify'
import xss from 'xss'
import Stream from 'node:stream'
import { S3 } from '@aws-sdk/client-s3';
import { supabaseAdmin } from '@/utils/supabase/admin'


const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-3'
});


export async function getMeals() {
  const { data, error } = await supabaseAdmin.from('meals').select('*');
  if (error) throw error;
  return data;
}

export async function getMeal(slug) {
  const { data, error } = await supabaseAdmin.from('meals').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function saveMeal(meal) {
meal.slug = slugify(meal.title, { lower: true });

meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;
//storing the image on the local file system
    // const stream = fs.createWriteStream(`public/images/${fileName}`)
    // const bufferedImage = await meal.image.arrayBuffer()
    // stream.write(Buffer.from(bufferedImage, (error) => {
    //     if(error) {
    //         throw new Error('Saving image failed!')
    //     }
    // }));
    // meal.image = `/images/${fileName}`

  const bufferedImage = await meal.image.arrayBuffer();

  s3.putObject({
    Bucket: 'food-app-next',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });


  meal.image = fileName;

 const { data, error } = await supabaseAdmin.from('meals').insert([meal]);
  if (error) throw error;
  return data;
}
