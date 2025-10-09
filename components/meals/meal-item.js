import Link from 'next/link';
import Image from 'next/image';

import classes from './meal-item.module.css';

export default function MealItem({ meal, currentUserEmail }) {
  const { title, slug, image, summary, creator, creator_email } = meal;
  const isOwner = currentUserEmail === creator_email;

  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={`https://food-app-next.s3.eu-west-3.amazonaws.com/${image}`} alt={title} fill
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
              <Link href={`/meals/${slug}/delete`}>Delete</Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}