import { defineStore } from 'pinia';

/*
interface ObjectList {
	[key: string]: string[];
}

export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('ms_keys');
		return {
			key: keys ? JSON.parse(keys) : <string[]>[],
			defaultList: <ObjectList>{
				admin: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
				user: ['1', '2', '3', '11', '13', '14', '15']
			}
		};
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
		}
	}
});
*/
interface ObjectList {
	[key: string]: string[];
}

/*export const usePermissStore = defineStore('permiss', {
	state: () => {
		const defaultList: ObjectList = {
			TEACHER:['1','2','4','7'],
			SCHOOL:[]
		};
        // 如果session中有角色，则使用对应的权限列表，否则使用空数组
		const keys = role ? defaultList[role] : [];
		return {
			key: keys,
			defaultList
		};
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
            // 同时更新sessionStorage中的角色对应的权限
			const role = sessionStorage.getItem('role');
			if (role) {
				sessionStorage.setItem('ms_keys', JSON.stringify(this.key));
			}
		}
	}
});*/
export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('ms_keys');
		return {
			key: keys ? JSON.parse(keys) : <string[]>[],
			defaultList: <ObjectList>{
				TEACHER:['2','4','7','10','12','15','17'],
				SCHOOL:['1','3','5','7','8','9','15','11','13','16','18']
			}
		};
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
		}
	}
});