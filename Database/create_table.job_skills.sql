drop table if exists job_skills;

create table job_skills (
	id uniqueidentifier not null,
	job_id uniqueidentifier,
	skill_id uniqueidentifier,
	constraint PK_job_skills primary key (id),
	constraint FK_job_skills_to_jobs foreign key (job_id) references Jobs (id),
	constraint FK_job_skills_to_skills foreign key (skill_id) references Skills (id)
);