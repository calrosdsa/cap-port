
const base_url = "http://localhost:1323"
const sendSmsRequest = async(number) => {
    const formData = new FormData()
    formData('PhoneNumber',number)
    await fetch(`${base_url}/v1/provider/sms-request/`).then(res=>{
        console.log(res)
        return res.json()
    }).then(res=>console.log(res))
    .catch(err=>console.log(err))
}