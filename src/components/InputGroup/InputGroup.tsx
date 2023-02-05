import {cloneElement} from 'react'

import styles from './input-group.module.scss'

export default function InputGroup({children}: { children: JSX.Element | JSX.Element[] }) {
    children = Array.isArray(children) ? children : [children]
    children[children.length - 1] = cloneElement(children[children.length - 1], {
        className: children[children.length - 1].props.className + ' ' + styles.lastElement
    })
    for (const index in children) {
        if (!children[index].key) {
            children[index] = cloneElement(children[index], {key: index})
        }
    }
    return <>
        {children}
        <hr className={styles.rule}/>
    </>
}
