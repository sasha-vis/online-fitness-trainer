import styles from "./loader.module.scss";

interface LoaderProps {
  fullscreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ fullscreen }) => {
  const wrapperCssClasses = fullscreen 
    ? `${styles.wrapper} ${styles.fullscreen}`
    : styles.wrapper;
  
  return (
    <div className={wrapperCssClasses}>
      <span className={styles.loader}></span>
    </div>
  );
};