# Building Your First Headless WordPress Project - DECODE 2023




## Step: 0
Fork this repository into your own account and clone locally so you can work with it.

From there, drag and drop the WordPress export, created by WP Migrate, into your Local development environment. All of the plugins you need should be installed and activated, you can log in with an admin account using these credentials:
```
Username: admin
Password: BWQqXaXnba(xg&JuBNgAl(7z
```

## Step 1: Configure Faust.js Environment Variables

Once you've gotten inside of your WordPress install, we can configure Faust.js to work with your WordPress site. To do that, you will need to update some settings in both your WordPress backend and your JavaScript application. 

First, open the `Settings > Faust` page in WP admin. Then set the `Front-end site URL` value to `http://localhost:3000` so that Faust can rewrite requests to your front end.

Next, click `Regenerate` to create a new `Secret Key` value and copy that value to your clipboard.

Now, transition back to your terminal and run the following command to create a new `.env.local` file from the sample:
```
cp env.local.sample env.local
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

To edit the homepage of your site, open the front page template in `/wp-templates/front-page.js` to get started. Each template file has three main parts: the component, a GraphQL query, and a variables callback.

The component determines what gets rendered, much like a typical page component would, and the `Component.query` and `Component.variables` properties allow us to colocate our queries with our component, and optionally receive the query results as `props` that are passed to the component or inside of the component using the `useQuery` hook.

