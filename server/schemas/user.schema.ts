import { Schema } from 'express-validator';

export function userSchema() {
    const schema: Schema = {
        username: {
            optional: {
                options: { nullable: true }
            },
            notEmpty: {
                errorMessage: "Username cannot be empty"
            },
            escape: true,
            isLength: {
                options: { max: 255 },
                errorMessage: "Username must be between 3 and 255 characters"
            }
        },
        mail: {
            exists: {
                errorMessage: "Email is required"
            },
            notEmpty: {
                errorMessage: "Email cannot be empty"
            },
            isEmail: {
                errorMessage: "Must be a valid email address"
            },
            normalizeEmail: true,
            escape: true
        },
        password: {
            exists: {
                errorMessage: "Password is required"
            },
            isLength: {
                options: { min: 8 },
                errorMessage: "Password must be at least 8 characters long",
            },
        },
    };

    function withUsername() {
        const updatedSchema = { ...schema };
        updatedSchema.username = {
            exists: {
                errorMessage: "Username is required"
            },
            notEmpty: {
                errorMessage: "Username cannot be empty"
            },
            escape: true,
            isLength: {
                options: { max: 255 },
                errorMessage: "Username must be between 3 and 255 characters"
            }
        };
        return updatedSchema;
    }

    return { schema, withUsername };
}
