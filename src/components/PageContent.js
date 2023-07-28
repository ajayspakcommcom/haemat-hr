import classes from './PageContent.module.css';

function PageContent({ title, children }) {
  return (
    <div className={`container-fluid ${classes.content}`}>
      {children}
    </div>
  );
}

export default PageContent;
