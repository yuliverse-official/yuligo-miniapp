import { GEARS_PART_ENUM } from "@/constrants/enums";

export interface SpeedBoostItemType {
    name: string;
    dex: number;
    speed: number;
    cost: number;
    icon: any;
    level?: number;
    key?: any;
    gear_id?: number | string;
    skill_id?: number | string;
    gear_type?: GEARS_PART_ENUM;
    cost_gear?: number; 
    gears_activated_count?: number; 
    gear_max?: boolean; 
}
  

export interface DataOptionsType {
    [key: string]: SpeedBoostItemType[];
}

interface AllUserRoles {
    [SpeedBoostTabs.Skill]: SpeedBoostItemType[];
    [SpeedBoostTabs.Gear]: SpeedBoostItemType[];
    roleConfig: {
        role_type: number | string,
        role_level_values: any[], 
        role_skill_values: any[],
    };
}

export interface AllUserRolesType {
    [key: string]: AllUserRoles[];
}

export enum Gear_Part_Type {
    Feet = 1,
    Hand,
    Body,
    Head,
    Enhancer,
}

export enum SpeedBoostTabs {
    Skill,
    Gear,
}

export const MAX_SKILL_LEVEL = 25;