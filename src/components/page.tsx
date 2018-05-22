import * as React from 'react'

function createPage(UnwrappedComponent: React.ComponentClass, getInitialProps: (props: any) => any) {
  return class extends React.Component {
    render() {
      const props = getInitialProps(this.props)
      return <UnwrappedComponent {...this.props} {...props} />
    }
  }
}

export {createPage}
