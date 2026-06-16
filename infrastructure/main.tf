terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0"
  
  # ⚠️ Backend non configuré (pas de state remote) - vulnérabilité
}

provider "aws" {
  region = var.aws_region
}

# ===== VPC =====
resource "aws_vpc" "devsecops_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "devsecops-vpc"
    Project     = "devsecops-pipeline"
    Environment = "dev"
  }
}

# ===== SUBNETS PUBLICS =====
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.devsecops_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "devsecops-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.devsecops_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "devsecops-public-subnet-2"
  }
}

# ===== INTERNET GATEWAY =====
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.devsecops_vpc.id

  tags = {
    Name = "devsecops-igw"
  }
}

# ===== ROUTE TABLE =====
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.devsecops_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "devsecops-public-rt"
  }
}

# ===== ROUTE TABLE ASSOCIATIONS =====
resource "aws_route_table_association" "public_rta_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rta_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

# =============================================
# ⚠️ VULNÉRABILITÉS AJOUTÉES (CHECKOV DÉTECTERA)
# =============================================

# ⚠️ 1. SECURITY GROUP - PORTS OUVERTS (CKV_AWS_23)
resource "aws_security_group" "allow_all" {
  name        = "allow_all_traffic"
  description = "⚠️ Allow all traffic - VULNÉRABLE"
  vpc_id      = aws_vpc.devsecops_vpc.id

  ingress {
    description = "Allow all inbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow-all-sg"
  }
}

# ⚠️ 2. S3 BUCKET PUBLIC - ACL public-read (CKV_AWS_20)
resource "aws_s3_bucket" "public_bucket" {
  bucket = "devsecops-public-bucket-${random_id.bucket_suffix.hex}"
  acl    = "public-read"

  tags = {
    Name        = "public-bucket"
    Environment = "dev"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# ⚠️ 3. S3 BUCKET VERSIONING DÉSACTIVÉ (CKV_AWS_144)
resource "aws_s3_bucket_versioning" "public_bucket_versioning" {
  bucket = aws_s3_bucket.public_bucket.id
  versioning_configuration {
    status = "Disabled"
  }
}

# ⚠️ 4. S3 BUCKET ENCRYPTION DÉSACTIVÉE (CKV_AWS_19)
resource "aws_s3_bucket_server_side_encryption_configuration" "public_bucket_encryption" {
  bucket = aws_s3_bucket.public_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ⚠️ 5. RDS NON CHIFFRÉ (CKV_AWS_29)
resource "aws_db_instance" "unencrypted_db" {
  identifier     = "devsecops-db"
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  storage_encrypted     = false  # ⚠️ Non chiffré
  publicly_accessible   = true   # ⚠️ Public
  skip_final_snapshot   = true
  
  db_name  = "devsecopsdb"
  username = "admin"
  password = "Password123!"
  
  vpc_security_group_ids = [aws_security_group.allow_all.id]
  db_subnet_group_name   = aws_db_subnet_group.devsecops_db_subnet_group.name

  tags = {
    Name = "unencrypted-db"
  }
}

# ⚠️ 6. DB SUBNET GROUP
resource "aws_db_subnet_group" "devsecops_db_subnet_group" {
  name       = "devsecops-db-subnet-group"
  subnet_ids = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]

  tags = {
    Name = "devsecops-db-subnet-group"
  }
}

# ⚠️ 7. EBS VOLUME NON CHIFFRÉ (CKV_AWS_3)
resource "aws_ebs_volume" "unencrypted_volume" {
  availability_zone = "${var.aws_region}a"
  size              = 10
  encrypted         = false  # ⚠️ Non chiffré

  tags = {
    Name = "unencrypted-volume"
  }
}

# ⚠️ 8. EC2 INSTANCE - IMAGE NON SÉCURISÉE (pas de monitoring)
resource "aws_instance" "vulnerable_instance" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnet_1.id

  vpc_security_group_ids = [aws_security_group.allow_all.id]

  # ⚠️ Pas de monitoring détaillé activé
  monitoring = false

  # ⚠️ Pas de volume root chiffré
  root_block_device {
    encrypted   = false
    volume_size = 8
  }

  tags = {
    Name = "vulnerable-instance"
  }
}