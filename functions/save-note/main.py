# add your save-note function here
import json
import boto3

dynamodb_resource = boto3.resource("dynamodb")
table = dynamodb_resource.Table("lotion-30143482")

def handler(event, context):
    access_token = event['headers']['authentication']
    url = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token={}'.format(access_token)
    response = urllib.request.urlopen(url)
    token_info = json.loads(response.read())
    if 'error' in token_info:
        return {
            'statusCode': 401,
            'body': 'Authentication error'
    }



    body = json.loads(event["body"])
    try:
        table.put_item(Item=body)     #table not defined yet!!!
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "sucessfully added note" 
            })
        }
    except Exception as exp:
        print(f"exception: {exp}")
        return{
            "staatusCode": 500,
            "body": json.dumps({
                "message": str(exp)
            })
        }
    

    
