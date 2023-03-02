import styles from './FoodResources.module.scss';

export default function FoodResources({recipeName, recipeLink}){
    return (
        <section className={styles.component}> 
            <h4>🌯 Cook Along</h4>
            <a href={recipeLink}>{recipeName}</a>
        </section>
    )
}