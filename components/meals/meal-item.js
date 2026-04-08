import Link from 'next/link';
import Image from 'next/image';
import DeleteMealButton from './delete-meal-button';

import classes from './meal-item.module.css';

export default function MealItem({ meal, currentUserEmail, showOwnerActions = false }) {
  const { title, slug, image, summary, creator, creator_email } = meal;
  const isOwner = showOwnerActions && currentUserEmail === creator_email;

  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={`https://rvvsyblinqvbgoshqhdi.supabase.co/storage/v1/object/public/meals/${image}`} alt={title} fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
            {isOwner && (
            <>
              <Link href={`/meals/${slug}/edit`}>Edit</Link>
              <DeleteMealButton slug={slug} title={title} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}