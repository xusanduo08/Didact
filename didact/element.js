export const TEXT_ELEMENT = 'TEXT_ELEMENT';

//  babel用这个方法来创建JSX的对象表示
export function createElement(type, config, ...arg){
    const props = Object.assign({}, config);
    const hasChildren = arg.length > 0;
    const rawChildren = hasChildren ? [].concat(...arg) : [];
    props.children = rawChildren.filter(c => c!=null && c != false)
        .map(c => c instanceof Object ? c : createTextElement(c));

    return { type, props};
}

export function createTextElement(value){
    return createElement(TEXT_ELEMENT, { nodeValue: value });
}