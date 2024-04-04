create procedure get_user_account_by_email (@email varchar(320)) as
begin

	select * from
		user_accounts as uac
	where
		uac.email = @email;

end;