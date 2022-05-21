import React from 'react';
import styles from './TextInput.module.css';

const TextInput = (props) => {
    return (
        <div>
            <input className={styles.input} style={{width:props.fullWidth==='ture'? '100%' :'inherit'}} type="text" {...props} />
        </div>
    );
};

export default TextInput;
