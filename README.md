# Red & Blue - React Components

NPM package that contains generic React components that can be used in all of our React-based projects.

Components placed here should not render any HTML, so that they can used in any project regardless of the UI, theme or styling.

### General notes

* Try to keep the library as dependency-free as possible, so it's stays small
* Always remember to increment the version number when adding features (`npm version [major/minor/patch]`)
* Do not render any HTML directly (make generic components or use children / render props)
