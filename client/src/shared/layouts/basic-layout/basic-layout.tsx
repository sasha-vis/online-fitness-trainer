import styles from './basic-layout.module.scss';
import { FC, ReactNode } from 'react';

interface BasicLayoutProps {
	headerSlot: ReactNode;
	children: ReactNode;
	footerSlot: ReactNode;
}

export const BasicLayout: FC<BasicLayoutProps> = ({
	headerSlot,
	children,
	footerSlot,
}) => {
	return (
		<div className={styles.layout_container}>
			<>{headerSlot}</>
			<>{children}</>
			<>{footerSlot}</>
		</div>
	);
};