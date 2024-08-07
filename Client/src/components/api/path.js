const URL = 'http://localhost:8000/api'
const userUrl = `${URL}/users`
const taskUrl = `${URL}/tasks`

var path ={
    signUpEmail: `${userUrl}/signup/email-form`,
    signUpOTP: `${userUrl}/signup/verify-email-otp`,
    signUpPassword: `${userUrl}/signup/password`,
    login: `${userUrl}/login`,
    forgotPassword: `${userUrl}/forgot-password`,
    forgotPasswordVerifyOTP: `${userUrl}/forgot-password/verify-otp`,
    resetPassword: `${userUrl}/forgot-password/set-password`,
    googleAuth: `${userUrl}/google`,

    //taskApis
    getTasks: `${taskUrl}/:profileId`,
    createTask: `${taskUrl}`,
    updateTask: `${taskUrl}/:taskId`,
    deleteTask: `${taskUrl}/:taskId`,
    getTask: `${taskUrl}/:taskId`,
    getProfiles: `${URL}/profiles`
}

export default path;