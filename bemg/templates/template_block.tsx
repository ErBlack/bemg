import { IClassNameProps } from '@bem-react/core';
import React, { FC } from 'react';

import { cn${Block} } from './${block}.const';

import './${block}.css';

export interface ${Block}Props extends IClassNameProps {
}

export const ${Block}: FC<${Block}Props> = ({ className }) => {
    return (
        <div className={cn${Block}.mix(className )}></div>
    );
};
