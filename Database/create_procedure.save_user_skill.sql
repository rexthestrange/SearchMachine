create procedure save_user_skill (@user_id uniqueidentifier, @skill_id uniqueidentifier, @active bit, @id uniqueidentifier output) as begin

	declare @user_skill_id uniqueidentifier;

	set @user_skill_id = (select id from user_skills where user_id = @user_id and skill_id = @skill_id);
	
	if (@user_skill_id is not null) 
		update user_skills set 
			active = @active
		where
			id = @user_skill_id
	else begin
		insert into user_skills values (
			newid(),
			@user_id,
			@skill_id,
			@active
		);

		set @user_skill_id = (select id from user_skills where user_id = @user_id and skill_id = @skill_id);

		select @user_skill_id;
	end;

end;