import React, { FC } from 'react';
import { cn${Block} } from '../${block}.const';

import './${block}__${elem}.css';

export interface ${Block}${Elem}Props {
}

export const ${Block}${Elem}: FC<${Block}${Elem}Props> = ({ children }) => (
    <div className={cn${Block}('${elem}')}>{children}</div>
);