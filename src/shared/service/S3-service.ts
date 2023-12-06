import * as AWS from 'aws-sdk'
import { ListObjectsV2Output, PutObjectOutput } from 'aws-sdk/clients/s3'

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
export default class S3Service {
  public static async getObjectFromBucket (params: { Bucket: string; Prefix: string }): Promise<ListObjectsV2Output> {
    const objects = await s3.listObjectsV2(params).promise()
    console.log(`S3Service::getObjectFromBucket - Object contents: ${JSON.stringify(objects.Contents, null, 2)}`)
    return objects
  }

  public static async putObjectInBucket (params: { Body: Buffer; Bucket: string, ContentType: string, Key: string }): Promise<PutObjectOutput> {
    try {
      const object = await s3.putObject(params).promise()
      console.log(`S3Service::putObjectInBucket - Object : ${JSON.stringify(object, null, 2)}`)
      return object
    }
    catch (err) {
        console.log(`S3Service::putObjectInBucket - Error : ${JSON.stringify(err, null, 2)}`)
        return
    }

    // const object = await s3.putObject(params).promise()
    // console.log(`S3Service::putObjectInBucket - Object : ${JSON.stringify(object, null, 2)}`)
    // return object
  }

  public static async deleteObjects (bucket: string, objects: ListObjectsV2Output) {
    const keys = objects.Contents.map(content => { return { Key: content.Key } })
    const result = await s3.deleteObjects({ Bucket: bucket, Delete: { Objects: keys } }).promise()
    console.log('S3Service::deleteObjects - Deleting objects: ', result)
    return result
  }
}
