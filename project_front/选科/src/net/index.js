import axios from 'axios'
import { ElMessage } from 'element-plus'

const authItemName = "access_token"
function unauthorized() {
	return !takeAccessToken()
}
const accessHeader = () => {
	return {
		'Authorization': `Bearer ${takeAccessToken()}`
	}
}
const defaultFailure =(message,code,url)=>{
	console.warn(`请求地址：${url}，状态码：${code},错误信息:${message}`)
	ElMessage.warning(message)
}

const defaultError=(err)=>{
	console.error(err)
	ElMessage.warning('发生了一些错误,请联系管理员')
}

function takeAccessToken(){
	const str= localStorage.getItem(authItemName)||sessionStorage.getItem(authItemName)
	if(!str) return null;
	const authObj = JSON.parse(str)
	if(authObj.expire<=new Date()){
		deleteAccessToken()
		ElMessage.warning('登陆状态已过期，请重新登录')
		return null;
	}
	return authObj.token
}
function deleteAccessToken(){
	localStorage.removeItem(authItemName)
	sessionStorage.removeItem(authItemName)
}
function storeAccessTokenAndRole(token,remember,role,expire){
	const authObj = {
		token:token,
		expire:expire,
	}
	const myRole = {role:role}
	const jRole = JSON.stringify(myRole)
	const str = JSON.stringify(authObj)
	if(remember){
		localStorage.setItem(authItemName,str)
	}
	else{
		sessionStorage.setItem(authItemName,str)
	}
	sessionStorage.setItem("role",jRole)
}
function post(url, data, success, failure = defaultFailure) {
	internalPost(url, data, accessHeader() , success, failure)
}
function get(url,success, failure = defaultFailure) {
	internalGet(url, accessHeader(), success, failure)
}
function deletes(url, success , failure = defaultFailure){
	internalDelete(url, accessHeader(), success, failure)
}

function internalPost(url,data,header,success,error,failure = defaultError){
	axios.post(url,data,{headers:header}).then(({data})=>{
		if(data.code===200){
			success(data.data)
		}else{
			failure(data.message,data.code,url)
		}
	}).catch(err=>error(err))
}

function internalGet(url,header,success,error,failure = defaultError){
	axios.get(url,{headers:header}).then(({data})=>{
		if(data.code===200){
			success(data.data)
		}else{
			failure(data.message,data.code,url)
		}
	}).catch(err=>error(err))
}
function internalDelete(url,header,success,error,failure = defaultFailure){
	axios.delete(url,{headers:header}).then(({data})=>{
		if(data.code===200){
			success(data.data)
		}else{
			failure(data.message,data.code,url)
		}
	}).catch(err=>(err))
}



function login(username,password,remember,success,failure=defaultFailure){
	internalPost('/api/auth/login',{   //url写什么？
		username:username,
		password:password
	},{
		'Content-Type':'application/x-www-form-urlencoded'
	},(data)=>{
		storeAccessTokenAndRole(data.token,remember,data.role,data.expire)
		ElMessage.success(`登陆成功，欢迎${data.username}来到我们的系统`)
		success(data)
	},failure)
}
function logout(success, failure = defaultFailure){
	get('/api/auth/logout', () => {
		deleteAccessToken()
		ElMessage.success(`退出登录成功，欢迎您再次使用`)
		success()
	}, failure)
}
function search(url,data,success,failure){
	post(url,data,(data)=>{
		success(data)
	},failure)
}
async function getMyData(url, respData) {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${takeAccessToken()}`
			},
			credentials: 'include',body: JSON.stringify(respData)
		})
		if (!response.ok) {
			throw new Error('Failed to fetch table data');
		}
		const data = await response.json();
		// 假设后台返回的数据格式是 { items: TableItem[] }
		return data.data; // 更新tableData的值
	} catch (error) {
		console.error('Error getting data:', error.message);
	}
}
function deleteData(url) {
	return new Promise((resolve, reject) => {
		deletes(url, (data) => {
			resolve(data); // 成功时解析数据
		}, (message) => {
			reject(message); // 失败时拒绝错误消息
		});
	});
}
function editData(url,data,success,failure){
	post(url,data,()=>{
		success()
	},failure)
}
function exportXlsx(url,success,failure){
	get(url,()=>{
		success()
	},failure)
}
export {login,unauthorized,get,post,logout,search,getMyData,deleteData,editData}