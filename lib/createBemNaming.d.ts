export interface BemEntity {
    block: string;
    elem?: string;
    modName?: string;
    modVal?: string | boolean;
}

export interface ModDelims {
    name: string;
    val: string;
}

export interface NamingOptions {
    elem?: string;
    mod?: string | ModDelims;
    wordPattern?: string;
}

export type BemEntityType = 'block' | 'blockMod' | 'elem' | 'elemMod';

export interface BemNaming {
    validate(str: string): boolean;
    parse(str: string): BemEntity;
    stringify(obj: BemEntity): string;
    typeOf(obj: BemEntity): BemEntityType;
    elemDelim: string;
    modDelim: string;
    modValDelim: string;
}

export function createBemNaming(options?: NamingOptions): BemNaming;
