import type { BlogPostData } from "../../redux/_types/blog_posts/dataTypes";
import type { IAuthState } from "@/redux/_types/auth/dataTypes";
import { UserData } from "@/redux/_types/users/dataTypes";

export const trimStringToSpecificLength = (stringToTrim: string, numOfChars?: number): string => {
  return `${stringToTrim.slice(0, numOfChars ? numOfChars : 10)}...`;
};

type FormatTimeStringOpts = {
  yearOnly?: boolean;
  yearMonth?: boolean;
  yearMonthDay?: boolean;
}
export const formatTimeString = (timeString: string, opts?: FormatTimeStringOpts): string => {
  const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

  try {
    const date = new Date(timeString);
    if (opts) {
    
      if (opts.yearOnly) {
        return date.getFullYear().toString();
      } else if (opts.yearMonth) {
        const monthIndex = date.getMonth();
        return `${months[monthIndex]} ${date.getFullYear()}`;
      } else if(opts.yearMonthDay) {
        const monthIndex = date.getMonth();
        const dayIndex = date.getDay();
        const dayOfMonth = date.getDate();
        const fullYear = date.getFullYear();
        return `${days[dayIndex]} ${months[monthIndex]} ${dayOfMonth} ${fullYear}`;
      }
    } else {
      return date.toLocaleDateString();
    }
  } catch(error) {
    console.log(error);
  }
};

// 
export const setDefaultBlogPosts = (blogPostData: BlogPostData[]): BlogPostData[] => {
  const defaultPostData: BlogPostData[] = [];
  for (let i = 0; i < 4; i++) {
    if (blogPostData[i]) {
      defaultPostData.push(blogPostData[i]);
    } else {
      const defaultBlogPost: BlogPostData = {
        _id: "",
        title: "A default title",
        author: { name: "Author", authorId: "anauthorid" },
        content: "Blog post content will go here",
        category: "beginner",
        slug: "slug",
        keywords: [ "default" ],
        published: false,
        likes: [],
        numOflikes: 0,
        createdAt: new Date(Date.now()).toISOString(),
        editedAt: new Date(Date.now()).toISOString(),
      }
      defaultPostData.push(defaultBlogPost);
    }
  }
  return defaultPostData;
};

export const capitalizeString = (stringToCapitalize: string): string => {
  return stringToCapitalize.slice(0, 1).toUpperCase() + stringToCapitalize.slice(1);
};

export const setPostAuthor = (authState: IAuthState): string => {
  const { firstName, lastName } = authState.currentUser ? authState.currentUser : { firstName: "", lastName: "" };
  if (firstName && lastName) {
    return `${capitalizeString(firstName)} ${capitalizeString(lastName)}`
  } else if (firstName || lastName) {
    return firstName ? capitalizeString(firstName) : capitalizeString(lastName);
  } else {
    return `Anonymous`;
  }
};

export const isDefined = (data: string | number): boolean => {
  if (typeof data === "string") {
    return data.length > 0 ? true : false;
  } else if (typeof data === "number") {
    return true;
  } else {
    return false;
  }
};
// helper to check if object values are empty/default state //
// note that in cases where key: [] or key: {} it will still be treated as empty //
type AnyObj = {
  [key: string]: any;
}
export const checkEmptyObjVals = (obj: AnyObj): boolean => {
  const keys: string[] = Object.keys(obj);
  if (keys.length > 0) {
    for (const key of keys) {
      if (!obj[key]) {
        continue;
      } else if (Array.isArray(obj[key]) && obj[key].length > 0) {
        return false;
      } else if(typeof obj[key] === "object" && obj[key] != null) {
        checkEmptyObjVals(obj[key]);
      } else {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }
};


// helpers related to users dashboard //
export class UserDashHelpers {
  private static readonly MOCK_OBJECT_ID: string = "625ee6f484359c25844ab1b7";

  public static get defaultUserInfo(): UserData {
    console.log("ran getter")
    return {
      _id: this.MOCK_OBJECT_ID,
      firstName: "John",
      lastName: "Doe",
      email: "john_doe@email.com",
      userType: "READER",
      confirmed: true,
      editedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  }
}