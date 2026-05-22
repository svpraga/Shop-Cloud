terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "shopcloud-terraform-state-0209"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "./modules/vpc"
}

module "rds" {
  source             = "./modules/rds"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

module "sqs_sns" {
  source = "./modules/sqs-sns"
}

module "lambda" {
  source        = "./modules/lambda"
  db_host       = module.rds.db_endpoint
  sqs_url       = module.sqs_sns.queue_url
  sqs_queue_arn = module.sqs_sns.queue_arn
  sns_arn       = module.sqs_sns.topic_arn
}

module "ecs" {
  source            = "./modules/ecs"
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
}

module "cdn" {
  source = "./modules/cdn"
}

output "api_gateway_id" {
  value = module.lambda.api_gateway_id
}

output "bucket_name" {
  value = module.cdn.bucket_name
}
