import React from "react";
import blogMainStyle from "../styles/BlogMainStyle.module.css";

const BlogPage: React.FC<{}> = (): JSX.Element => {


  return (
    <div className={ blogMainStyle.blogWrapper }>
      Blog page
    </div>
  )
};

export default BlogPage;