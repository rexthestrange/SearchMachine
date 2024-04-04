-- drop procedure save_skill;

create procedure save_skill (@skill varchar (127), @user_id uniqueidentifier) as begin

	declare @id uniqueidentifier;

	if not exists (select * from skills where trim(lower(skill)) = trim(lower(@skill))) insert into skills values (
		newid (), 
		trim(lower(@skill))
	);

	select @id = id from skills where skill = @skill;

	select 
		@id as skill_id,
		@user_id as user_id,
		@skill as skill,
		usk.active
	from 
		skills as skl
	left join
		user_skills as usk
	on
		(usk.user_id = @user_id) and
		(usk.skill_id = skl.id)
	where 
		trim(lower(skill)) = trim(lower(@skill));

end;