# HISTORY OF WEB - 4

## Prerequisites

Prepare AWS CLI v2 (check [other ways](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html)):

  ```bash
  # Install
  brew install awscli

  # Check
  aws --version
    # aws-cli/2.xx.x ...
  ```

  ```bash
  # Install recommend
  brew install jq

  # Check
  jq --version
    # jq-1.6
  ```

## A. Static Contents Private Access Control

### A-1. [Create new AWS IAM policy](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/access_policies_create-console.html)

**Policy naming in this project**: `{ENV}-{TIER}-bucket-object-control`

> Environment: `dev`  
> Tier: `web`  
> Policy name: `dev-web-bucket-object-control`

Policy ruleset:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowToViewBucketContentsOf{TIER}In{ENV}",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::{BUCKET_NAME}"
        },
        {
            "Sid": "AllowToControlBucketContentsOf{TIER}In{ENV}",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::{BUCKET_NAME}/*"
        }
    ]
}
```

Read more: [Allowing an IAM user access to one of your buckets](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/example-policies-s3.html#iam-policy-ex0)

### A-2. [Create new AWS IAM role](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/access_policies_job-functions_create-policies.html)

Attatch created IAM policy to new IAM role

> Target Policy: `dev-web-bucket-object-control`

**Role naming in this project**: `{TIER}-deployer-to-{ENV}`

> Environment: `dev`  
> Tier: `web`  
> Role name: `web-deployer-to-dev`

### A-3. [Grant a user permission to switch IAM roles](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/id_roles_use_permissions-to-switch.html#roles-usingrole-createpolicy)

**Customized Role Permission with Inline Policy**:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        // ...
        {
            "Sid": "AllowToAssumeRoleForDeployment",
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": [
                "arn:aws:iam::{AWS_ACCOUNT_ID}:role/{TIER}-deployer-to-{ENV}"
            ]
        }
    ]
}
```

> Environment: `dev`  
> Tier: `web`
> Target Inline Policy contents at **IAM User**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        // ...
        {
            "Sid": "AllowToAssumeRoleForDeployment",
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": [
                "arn:aws:iam::111111111111:role/story-deployer-to-dev",
                "arn:aws:iam::111111111111:role/web-deployer-to-dev",
                "arn:aws:iam::111111111111:role/web-deployer-to-prod"
            ]
        }
    ]
}
```

### A-4. [Set AWS credentials (after IAM user & role setting)](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/id_roles_use_switch-role-cli.html)

Add credentials and assuming rule in local for AWS CLI

```bash
# Open the sensitive data
code ~/.aws/credentials
```

Maybe your data like below format:

```bash
# ------------------------------
# TOY-DK2WEB :: user credentials
# ------------------------------
[toy-dk2web-user]
aws_access_key_id     = AAAAAAAAAAAAAAAAAAAA
aws_secret_access_key = BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB

# ------------------------------------------------
# TOY-DK2WEB :: role for 'toy-web' in 'dev'
# ------------------------------------------------
[web-deployer-to-dev]
source_profile = toy-dk2web-user
role_arn       = arn:aws:iam::111111111111:role/web-deployer-to-dev
```

```bash
# Set profile
export AWS_PROFILE="web-deployer-to-dev"

# Check the credentials
aws sts get-caller-identity --output=json | jq
```

## B. Contents Storage on AWS CLI

### B-1. [Create new Amazon S3 bucket](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/creating-bucket.html)

Bucket name: `web.dev.poc-in.site`

**Bucket naming in this project**: `{TIER}.{ENV}.poc-in.site`

> Environment: `dev`  
> Tier: `web`  
> Role name: `web.dev.poc-in.site`

### B-2. Check on AWS CLI

```bash
# Set environment variable
export TARGET_WEB_BUCKET="web.dev.poc-in.site"
env | grep "TARGET_WEB_BUCKET"

# Check the permission: upload local items to remote S3 bucket(target)
aws s3 sync "./public" "s3://${TARGET_WEB_BUCKET:?}/public"
    # upload: public/vercel.svg to s3://web.dev.poc-in.site/public/next.svg
    # upload: public/next.svg to s3://web.dev.poc-in.site/public/next.svg

# Check the permission: current state of remote S3 bucket(target)
aws s3 ls "s3://${TARGET_WEB_BUCKET:?}/public" --recursive
  # 2023-08-22 18:09:47       1375 public/next.svg
  # 2023-08-22 18:09:47        629 public/vercel.svg

# Check the permission: remove an object at remote S3 bucket(target)
aws s3 rm "s3://${TARGET_WEB_BUCKET:?}/public" --recursive
  # delete: s3://web.dev.poc-in.site/public
```

Usage examples:

- aws.[s3.sync](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/sync.html#examples)
- aws.[s3.ls](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/ls.html#examples)
- aws.[s3.rm](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/rm.html#examples)

## C. Expose Amazon S3 Bucket contents to public with CDN using AWS CloudFront

### C-1. [Create new public certificate using AWS Certificate Manager](https://docs.aws.amazon.com/ko_kr/acm/latest/userguide/gs-acm-request-public.html)  

**Certificate domain naming in this project**: `*.{ENV}.poc-in.site`

> Environment: `dev`  
> Certifinate name: `*.dev.poc-in.site`

Then, record to DNS service to validate the certificate:

```bash
# Check the DNS record
nslookup <CNAME>
# or
dig <CNAME>
```

### C-2. [Create new distribution using AWS CloudFront](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/distribution-web-creating-console.html)

**Distribution naming in this project**: `{TIER}.{ENV}.poc-in.site`

> Environment: `dev`  
> Tier: `web`  
> Distribution name: `web.dev.poc-in.site`

1. Click Create Distribution
2. Set origin configuration:  

    > **Origin domain**: `web.dev.poc-in.site.s3.ap-northeast-2.amazonaws.com`  
    > **Name**: `web.dev.poc-in.site`  
    > **Origin access control**: (Create new OAC config with description)  
    > --> `S3 Origin Access Control - sign requests`
    >
    > ---
    >
    > ! Policy must allow access to CloudFront IAM service principal role.
    > ==> Set on no.6

3. Set basic cache behavior:

    > **Viewer protocol policy**: `Redirect HTTP to HTTPS`  
    > **Cache key & origin request**: `CORS-S3Origin`

4. Set config:

    > **Alternative domain name(CNAME)**: `web.dev.poc-in.site`  
    > **Custom SSL Certificate**: `*.dev.poc-in.site`  
    > **Surport HTTP versions**:  
    >
    > - [X] HTTP/2
    > - [X] HTTP/3
    >  
    > **Default root object**: `index.html`  
    > **Description**: `dev/web`

5. Create Distribution

    Set error pages > custom error response >
    `403:Forbidden` + `/404.html`

6. Update origin S3 bucket policy:

    ```json
    {
        "Version": "2008-10-17",
        "Id": "PolicyForCloudFrontPrivateContent",
        "Statement": [
            {
                "Sid": "AllowCloudFrontServicePrincipal",
                "Effect": "Allow",
                "Principal": {
                    "Service": "cloudfront.amazonaws.com"
                },
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::web.dev.poc-in.site/*",
                "Condition": {
                    "StringEquals": {
                      "AWS:SourceArn": "arn:aws:cloudfront::111111111111:distribution/{______________}"
                    }
                }
            }
        ]
    }
    ```

7. Update origin S3 bucket CORS setting:

    ```json
    [
        {
            "AllowedHeaders": [
                "Authorization",
                "Content-Length"
            ],
            "AllowedMethods": [
                "GET",
                "HEAD"
            ],
            "AllowedOrigins": [
                "https://web.dev.poc-in.site"
            ],
            "ExposeHeaders": [],
            "MaxAgeSeconds": 3000
        }
    ]
    ```

### C-3. Regist distribution's CNAME to owned Domain Name Server (e.g gabia)

Then, record to DNS service to validate the certificate:

```bash
# Check the DNS record
nslookup <CNAME>
# or
dig <CNAME>
```
