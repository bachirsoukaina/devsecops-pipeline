output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.devsecops_vpc.id
}

output "public_subnet_1_id" {
  description = "Public Subnet 1 ID"
  value       = aws_subnet.public_subnet_1.id
}

output "public_subnet_2_id" {
  description = "Public Subnet 2 ID"
  value       = aws_subnet.public_subnet_2.id
}

output "eks_cluster_name" {
  description = "EKS Cluster Name"
  value       = aws_eks_cluster.devsecops_cluster.name
}

output "eks_cluster_endpoint" {
  description = "EKS Cluster Endpoint"
  value       = aws_eks_cluster.devsecops_cluster.endpoint
}

output "eks_cluster_version" {
  description = "EKS Cluster Version"
  value       = aws_eks_cluster.devsecops_cluster.version
}