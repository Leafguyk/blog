import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// sorting func
const sortFunctions = {
  sortFn: (a: any, b: any) => {
    const orderA = a.data?.order ?? a.file?.frontmatter?.order ?? 9999
    const orderB = b.data?.order ?? b.file?.frontmatter?.order ?? 9999
    
    if (orderA !== orderB) {
      return orderA - orderB
    }
    
    // Alphabetical fallback
    const nameA = a.displayName ?? a.name
    const nameB = b.displayName ?? b.name
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' })
  }
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/Leafguyk"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(sortFunctions),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(sortFunctions),
  ],
  right: [],
}
