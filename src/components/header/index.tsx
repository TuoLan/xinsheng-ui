import styles from "./index.module.scss";
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isBack: boolean;
  title: string;
  children?: React.ReactNode
}

function Header(props: HeaderProps) {
  const { isBack = false, title = '鑫盛冷饮', children = <></> } = props;
  const navigate = useNavigate()
  return (
    <div className={styles.header}>
      {isBack && <div className={styles.back} onClick={() => navigate(-1)} ><LeftOutlined className={styles.back} /></div>}
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
}

export default Header;
