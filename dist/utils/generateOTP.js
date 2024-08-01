"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateOTP = (size, type) => {
    if (size < 1 && size > 10) {
        throw new Error('Invalid OTP size');
    }
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let otpChars = '';
    if (type === 'numeric') {
        otpChars = numbers;
    }
    else if (type === 'alphanumeric') {
        otpChars = numbers + characters;
    }
    else if (type === 'alphabet') {
        otpChars = characters;
    }
    else {
        throw new Error('Invalid OTP type');
    }
    let otp = '';
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * otpChars.length);
        otp += otpChars.charAt(randomIndex);
    }
    return otp;
};
exports.default = generateOTP;
