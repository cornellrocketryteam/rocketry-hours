declare var BASE_URL: string;
export const baseurl = BASE_URL || "http://localhost:3000";

const formURLEncode = function (body: Record<string, string>): string {
	if (!body) {
		return "";
	}

	let paramStr = "";

	let first = true;
	for (const key in body) {
		const value = body[key];
		if (first) {
			first = false;
		} else {
			paramStr += "&";
		}
		paramStr += key;
		paramStr += "=";
		paramStr += encodeURIComponent(value);
	}

	return paramStr;
};

export const GET = async function <T>(endpoint: string): Promise<T> {
	const response = await fetch(baseurl + "/" + endpoint, { credentials: "include" });
	const json = await response.json() as RocketryAdminAPI_response;

	if (json.status == "error") {
		throw json.error;
	}

	return json.data as T;
};

export const POST = async function <T>(endpoint: string, body: Record<string, string>): Promise<T> {
	const response = await fetch(baseurl + "/" + endpoint, {
		method: "POST",
		body: formURLEncode(body),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		credentials: "include"
	});
	const json = await response.json() as RocketryAdminAPI_response;

	if (json.status == "error") {
		throw json.error;
	}

	return json.data as T;
};


//This only kinda works, use with caution!


export interface RocketryAdminAPI_response {
	status: string;
	error: string;
	data: any;
}
export interface RocketryAdminAPI_user {
	id: number;
	subteam: string;
	netId: string;
	fname: string;
	lname: string;
	email: string;
	picture: string;
	userLevel: number;
}
export interface RocketryAdminAPI_category {
	id: number;
	name: string;
}
export interface RocketryAdminAPI_hour {
	id: number;
	hours: number;
	date: string;
	categoryId: number;
	metGoals: number;
	desc: string;
}
export interface RocketryAdminAPI_hoursResponse {
	hour: RocketryAdminAPI_hour[];
	categories: RocketryAdminAPI_category[];
}
export interface RocketryAdminAPI_subteam {
	id: number;
	name: string;
}

export interface RocketryAdminAPI_rosterItem {
	id: number;
	subteamId: number;
	netId: string;
	fname: string;
	lname: string;
	email: string;
	userLevel: number;
}