import argon2 from 'argon2';

export default class HashHelper {
	static async compare(password: string, hash: string): Promise<boolean> {
		return argon2.verify(hash, password);
	}

	static async hash(password: string): Promise<string> {
		return argon2.hash(password);
	}
}
