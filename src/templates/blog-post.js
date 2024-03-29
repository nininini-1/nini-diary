import React from "react"
import { graphql } from "gatsby"
import Layout from "@/components/layout"
import SEO from "@/components/seo"

import TechTag from "@/components/tags/TechTag"

const BlogPost = props => {
  const post = props.data.markdownRemark
  const labels = props.data.site.siteMetadata.labels
  const tags = post.frontmatter.tags

  const getTechTags = tags => {
    const techTags = []
    tags.forEach((tag, i) => {
      labels.forEach(label => {
        if (tag === label.tag) {
          techTags.push(
            <TechTag
              key={i}
              tag={label.tag}
              tech={label.tech}
              name={label.name}
            />
          )
        }
      })
    })
    return techTags
  }

  return (
    <Layout>
      <SEO title={post.frontmatter.title} />
      <div className="mt-3">
        <h2 className="heading">{post.frontmatter.title}</h2>
        <div className="d-block">{getTechTags(tags)}</div>
        <br />
        <div className="mx-0 row justify-content-between mb-3">
          <small className="text-info">发表于 {post.frontmatter.date}</small>
          {/* <small className="text-info">阅读量： {post.timeToRead}</small> */}
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        url
        title
        labels {
          tag
          tech
          name
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        tags
      }
    }
  }
`

export default BlogPost
