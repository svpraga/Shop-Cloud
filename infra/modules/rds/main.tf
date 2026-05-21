resource "aws_db_instance" "postgres" {
  identifier          = "shopcloud-db"
  engine              = "postgres"
  engine_version      = "17.4"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  db_name             = "shopcloud"
  username            = "shopcloud_user"
  password            = var.db_password
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  publicly_accessible = false
  skip_final_snapshot = true
  tags = { Name = "shopcloud-rds" }
}
resource "aws_db_subnet_group" "main" {
  name       = "shopcloud-subnet-group"
  subnet_ids = var.private_subnet_ids
}
resource "aws_security_group" "rds" {
  name   = "shopcloud-rds-sg"
  vpc_id = var.vpc_id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # only within VPC
  }
}
output "db_endpoint" { value = aws_db_instance.postgres.address }
