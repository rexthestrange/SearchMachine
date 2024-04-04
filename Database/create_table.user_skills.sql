drop table user_skills;

create table user_skills (
	id uniqueidentifier not null,
	user_id uniqueidentifier not null,
	skill_id uniqueidentifier not null,
	active bit default 0,
	primary key (id, skill_id),
	constraint FK_user_skills_to_user_accounts foreign key (user_id) references user_accounts (id),
	constraint FK_user_skills_to_skills foreign key (skill_id) references skills (id)
);
