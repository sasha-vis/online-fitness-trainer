import style from './footer.module.scss';

export const Footer = () => {
    return (
        <div>
            <p className={style.text_block}>© 2024 MyFit. Все права защищены.</p>
            <p className={style.text_block}>Разработано командой Team2</p>
        </div>
    );
};
