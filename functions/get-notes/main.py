# add your get-notes function here
import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("lotion-30143482")

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


    
    email = event["queryStringParameters"]["email"]

    try:
        res = table.query(KeyConditionExpression=Key("email").eq(email))
        return {
            "statusCode": 200,
            "body": json.dumps(res["Items"])
        }
    except Exception as exp:
        print(exp)
        return{
            "statusCode": 500,
            "body": json.dumps({"message": str(exp)})
        }
    

