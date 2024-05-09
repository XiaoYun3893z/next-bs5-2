import styles from './loader.module.css'

export default function Loader() {
  return (
    <>
      <div className={styles['lds-ripple']}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  )
}
