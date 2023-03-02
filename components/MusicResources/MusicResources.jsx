import styles from './MusicResources.module.scss';

export default function MusicResources({trackTitle, artist, album}){
    return (
        <section className={styles.component}> 
            <h4>💿 Jam Along</h4>
            <div><i>{trackTitle}</i> by {artist} from the album "{album}"</div>
        </section>
    )
}