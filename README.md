# Building Your First Headless WordPress Project - DECODE 2023




## Step 0: Configure WordPress and Explore Resources
Fork this repository into your own account and clone locally so you can work with it.

From there, drag and drop the WordPress export, created by WP Migrate, into your Local development environment. All of the plugins you need should be installed and activated, you can log in with an admin account using these credentials:
```
Username: admin
Password: BWQqXaXnba(xg&JuBNgAl(7z
```
Please check out [this article on SSL with Local](https://localwp.com/help-docs/ssl/ssl-in-local/) if you have issues using HTTPS on your machine.

This WordPress site comes pre-installed with a few important plugins you'll need on your journey to build this headless site.

- [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/)
- [WPGraphQL for Advanced Custom Fields](https://www.wpgraphql.com/acf)
- [WPGraphQL](https://wordpress.org/plugins/wp-graphql/)
- [Faust](https://wordpress.org/plugins/faustwp/)


## Step 1: Configure Faust.js Environment Variables

Once you've gotten inside of your WordPress install, we can configure Faust.js to work with your WordPress site. To do that, you will need to update some settings in both your WordPress backend and your JavaScript application. 

First, open the `Settings > Faust` page in WP admin. Then set the `Front-end site URL` value to `http://localhost:3000` so that Faust can rewrite requests to your front end.

Next, click `Regenerate` to create a new `Secret Key` value and copy that value to your clipboard.

Now, transition back to your terminal and run the following command to create a new `.env.local` file from the sample:
```
cp .env.local.sample .env.local
```
 In this file, you will replace the `NEXT_PUBLIC_WORDPRESS_URL` value with `https://acfheadless.wpengine.local/` and the `FAUST_SECRET_KEY` value with the contents of your clipboard.

 ```
 # Your WordPress site URL
NEXT_PUBLIC_WORDPRESS_URL=https://acfheadless.wpengine.local/

# Plugin secret found in WordPress Settings->Faust
# FAUST_SECRET_KEY=YOUR_PLUGIN_SECRET
```

Save this file, and then we're ready to test our connection. Run the following commands to install your JavaScript dependencies:
```
npm run install
npm run dev
```

Now, you should have a Faust.js-powered site running on `http://localhost:3000`!

## Step 2: Making a Dynamic Homepage

Out of the box, Faust.js implements a variation of [the WordPress template hierarchy](https://faustjs.org/docs/templates) that is used with traditional PHP themes. When a route is requested on the front-end site, Faust.js uses Next.js' flexible routing rules to resolve the request. 

If there is no route match in the traditional `/pages` directory, Faust fallbacks to resolving the content using the `[...wordpressNode].js` page component, which implements the template hierarchy using the template components contained in the `wp-templates` directory. 

To determine which template to use with your content, Faust uses [a concept called the seed query](https://faustjs.org/docs/faustwp/seed-query) to check the URI of the content requested against all of the URIs that WordPress manages. If it finds a match, it sends back some initial information about the content item that can be used to render the template and make additional requests for data. 

The idea of using `uri` instead of `slug` might be a change for some developers, but after watching hours of developers creating headless WordPress sites, it became clear how much time and effort was spent in managing routing in Next.js that WordPress was already creating for us using its own routing mechanisms. You can read more about the utility of [leaning into WordPress uris in this post](https://www.wpgraphql.com/2021/12/23/query-any-page-by-its-path-using-wpgraphql).

To edit the homepage of your site, open the front page template in `/wp-templates/front-page.js` to get started. Each template file has three main parts: the component, a GraphQL query, and a variables callback.

The component determines what gets rendered, much like a typical page component would, and the `Component.query` and `Component.variables` properties allow us to colocate our queries with our component, and optionally receive the query results as `props` that are passed to the component or inside of the component using the `useQuery` hook.

### Step 2.1: Update the Query Property

To get the extra data we need to display posts on our homepage, you will need to add the following lines to the `Component.query` property in the `/wp-templates/front-page.js` file.

```
posts(first: 10) {
    nodes {
        title
        excerpt
        uri
        categories {
            nodes {
            name
            uri
            }
        }
    }
}
```

This will make our additional post data available inside of our component, but we still need display that data. Add an additional line to your `Component` code to extract `posts` into a variable:
```
const posts = data?.posts?.nodes;
```
Now you can create an additional component to render the posts inside of the content container.

### Step 2.2: Creating a PostExcerpt Component

To create an additional component, create a new directory called `/components/PostExcerpt` and create these three files inside of the directory:
```
PostExcerpt.js
index.js
PostExcerpt.modules.scss
```
First, set the contents of `PostExcerpt.js` to this:

```
import styles from './PostExcerpt.module.scss';

export default function PostExcerpt({post}) {
    return (
        <section key={post?.title} className={styles.component}>
          <a href={post?.uri}><h3>{post?.title}</h3></a>
          <div>
            Categories:
            { post?.categories?.nodes.map(category =>{
                return (<span>
                    <a 
                    key={`${category?.name}-${post?.title}`} 
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
```
This code creates our `PostExcerpt` component, and imports some our styles and scopes them to the component.

From here, add the following style rules to the `PostExcerpt.modules.scss` file:
```
.component {
    span {
        margin: 0 .25rem;
    }
}
```
Then export the component in `components/PostExcerpt/index.js`:
```
export { default as PostExcerpt} from './PostExcerpt'
```

To make our component available, import and export our new `PostExcerpt` component from `components/index.js`:
```
export { PostExcerpt } from './PostExcerpt';
```
It's worth noting that the component organization you see here is a convention of the Faust.js getting started template and not a requirement. If you want to organize your components in a different way, or use another styling convention, that is totally up to you.

### Step 2.3: Update Homepage
To make the `PostExcerpt` component available in our homepage add it to the existing import statement in `/wp-templates/front-page.js`:

```
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  Hero,
  SEO, 
  PostExcerpt
} from '../components';
```
From here, since you've already defined the value of `posts` in this file, update the `Main` component code to map through our array of posts and render a `PostExcerpt` component for each entry:
```
<Main>
    <Container>
        <Hero title={'Headless Demo'} />
        <div className="text-center">
            {posts.map(post => {
                return (<PostExcerpt post={post}></PostExcerpt>)
            })}
        </div>
    </Container>
</Main>
```
Now, if you save this file and refresh your homepage in the browser, the most recent posts should be displayed 🎉

## Step 3: Display ACF Fields on Single Post Page

Now that we have an idea of how Faust.js works, you can update your `/wp-templates/single.js` file to consume and display data from the custom data fields created with ACF.







