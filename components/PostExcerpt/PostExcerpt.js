import styles from './PostExcerpt.module.scss';

export default function PostExcerpt({post}) {
    return (
        <section className={styles.component}>
          <a href={post?.uri}><h3>{post?.title}</h3></a>
          <div>
            Categories:
            { post?.categories?.nodes.map(category =>{
                return (<span key={`${category?.name}-${post?.title}`}>
                    <a 
                    href={category?.uri}>{category?.name}
                    </a>
                </span>)
                })
            }
          </div>
          <div dangerouslySetInnerHTML={{__html: post?.excerpt}}></div>
        </section>
      )
}