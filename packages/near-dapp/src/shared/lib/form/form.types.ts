import {Form} from 'effector-forms';

export type ValuesOfForm<Type> = Type extends Form<infer Values> ? Values : never;
