import { useQuery, gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  Hero,
  SEO,
} from '../components';

export default function Component() {
  const { data } = useQuery(Component.query, {
    variables: Component.variables(),
  });

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];
  const posts = data?.posts?.nodes;

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <Hero title={'Headless Demo'} />
          <div className="text-center">
            {posts.map(post => {
              return (
                <section key={post.title}>
                  <a href={post.uri}><h3>{post.title}</h3></a>
                  <div>
                    Categories:&nbsp;
                    { post.categories?.nodes.map(category =>{
                      return (<span>
                        <a 
                          key={`${category.name}-${post.title}`} 
                          href={category.uri}>{category.name}
                        </a><span>&nbsp;&nbsp;</span>
                      
                      </span>)
                    })
                    }
                  </div>
                  <div dangerouslySetInnerHTML={{__html: post.excerpt}}></div>
                </section>
              )
            })}
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
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
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
