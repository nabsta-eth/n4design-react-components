import React from "react";
import { setClassNames } from "../../utils/set-class-names";
import { ArticleProps } from "../../types";

export function Article(props: ArticleProps) {
  return (
    <article
      id={props.id ? props.id : ""}
      style={props.style}
      className={`
                  uk-article
                  ${setClassNames(props)}
              `}
    >
      <h1 className="uk-article-title">{props.title}</h1>
      {props.meta ? <p className="uk-article-meta">{props.meta}</p> : ""}
      {props.lead ? <p className="uk-text-lead">{props.lead}</p> : ""}
      <div>{props.children}</div>
    </article>
  );
}

// export class Article extends React.Component<ArticleProps, any> {
//   render() {
//     return (
//       <article
//         id={this.props.id ? this.props.id : null}
//         style={this.props.style}
//         className={`
//                     uk-article
//                     ${setClassNames(this.props)}
//                 `}
//       >
//         <h1 className="uk-article-title">{this.props.title}</h1>
//         {this.props.meta ? <p className="uk-article-meta">{this.props.meta}</p> : ''}
//         {this.props.lead ? <p className="uk-text-lead">{this.props.lead}</p> : ''}
//         <div>{this.props.children}</div>
//       </article>
//     )
//   }
// }

export default Article;
