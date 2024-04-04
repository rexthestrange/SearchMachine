create table dbo.user_accounts(
	Id uniqueidentifier not null,
	FirstName varchar(32),
	LastName varchar(32),
	Email varchar(320),
	Phone varchar(15),
	constraint PK_job_skills primary key (id)
);