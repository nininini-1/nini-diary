import React from "react"
import PropTypes from "prop-types"
import { Link, graphql } from "gatsby"
import "bootstrap/dist/css/bootstrap.css"
import "@/pages/index.css"

import Layout from "@/components/layout"
import SEO from "@/components/seo"
import TechTag from "@/components/tags/TechTag"

const Date = ({ pageContext, data }) => {
  const posts = data.allMarkdownRemark.edges
  const labels = data.site.siteMetadata.labels
  const { totalCount } = data.allMarkdownRemark

  const titleHeader = `共查询到 ${totalCount} 篇博客`

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
      <SEO title="日期" />
      <i>
        <h2 className="heading mx-3">{titleHeader}</h2>
      </i>
      {posts.map(post => {
        const tags = post.node.frontmatter.tags
        return (
          <div key={post.node.id} className="container mt-5">
            <Link to={post.node.fields.slug} className="text-dark">
              <h2 className="heading">{post.node.frontmatter.title}</h2>
            </Link>
            <div className="mx-0 row justify-content-between">
              <small className="text-info">
                发表于 {post.node.frontmatter.date}
              </small>
              {/* <small className="text-info">
                阅读量：{post.node.timeToRead}
              </small> */}
            </div>
            <p className="mt-3 d-inline">{post.node.excerpt}</p>
            <Link to={post.node.fields.slug} className="text-primary">
              <small className="d-inline-block ml-3"> 阅读全文</small>
            </Link>
            <div className="d-block">{getTechTags(tags)}</div>
          </div>
        )
      })}
    </Layout>
  )
}

Date.propTypes = {
  pageContext: PropTypes.shape({
    date: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export const pageQuery = graphql`
  query($date: Date, $nextMonth: Date) {
    site {
      siteMetadata {
        title
        author
        labels {
          tag
          tech
          name
        }
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { date: { gt: $date, lt: $nextMonth } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 120)
          html
          id
          timeToRead
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            tags
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export default Date
