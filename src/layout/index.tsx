import React from 'react';
import Home from "../view/home"
import styles from "./index.module.scss"

function Layout() {
  return (
    <div className={styles.layout}>
      <Home />
    </div>
  )
}

export default Layout